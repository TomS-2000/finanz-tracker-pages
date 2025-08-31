import Tesseract from "tesseract.js";

type Article = {
  title: string;
  value: string;
};

function parseKassenbon(text: string) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const ignore = ["summe", "rückgeld", "steuer", "datum", "kasse", "filiale", "zeit", "bar", "brutto", "netto", "%"];
    const artikel: Article[] = [];
    let shop = "";

    for (const line of lines) {
        if (!shop && line.match(/.{3,}$/)) {
            shop = line;
        }

        const lower = line.toLowerCase();
        if (ignore.some((word) => lower.includes(word))) continue;

        let cleanLine = line.replace(/[„~–—−]/g, "-");
        const match = cleanLine.match(
            /(.+?)\s+([-+]?\d+[\.,]\d{2})[\s*€][€*]?[\s]?[AB12](.{1,3})?$/
        );
        if (match) {
            const title = match[1].trim();
            let valueN = parseFloat(match[2].replace(",", "."));
            let value: string = (-valueN).toFixed(2);
            artikel.push({ title, value });
        }
    }

    return artikel;
}

function optimizeImageForOCR(file: File): Promise<File> {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        
        img.onload = () => {
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const maxSize = isMobile ? 1920 : 3840; // Mobile 1920px, PC 3840px
            let { width, height } = img;
            
            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                } else {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            // Höhere Qualität für PC, komprimierter für Mobile
            const quality = isMobile ? 0.8 : 0.95;
            canvas.toBlob((blob) => {
                if (blob) {
                    const optimizedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(optimizedFile);
                } else {
                    resolve(file);
                }
            }, 'image/jpeg', quality);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

export async function getTextFromPhoto(file: File) {
    let isLoading = true;
    try {

        const optimizedFile = await optimizeImageForOCR(file); 
        const { data } = await Tesseract.recognize(optimizedFile, "deu");

        const resultText = data.text;
        const articleListe = parseKassenbon(data.text);

        return articleListe;
    } catch (error) {
        console.error("Fehler bei OCR:", error);
    } finally {
        isLoading = false;
    }
}