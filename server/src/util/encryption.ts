import dotenv from "dotenv"
import path from "path";

dotenv.config({
    path: path.join(__dirname, '../.env')
})

import crypto from "crypto";

export function textEncryption(algorithm: string, text: string): any {

    const secret = crypto.scryptSync(process.env.SECRET || '', 'salt', 24);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secret, iv)
    const encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    return {
        encryptedText,
        iv
    }
}

export function textDecrypt(algorithm: string, encryption: string): string {
    const secret = crypto.scryptSync(process.env.SECRET || '', 'salt', 24);
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv(algorithm, secret, iv)
    const decryptedText = decipher.update(encryption, 'hex', 'utf8') + decipher.final('utf8');

    return decryptedText
}
