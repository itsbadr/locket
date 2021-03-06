import TextModel from "../db/models/text/text.schema";
import { Text } from "../db/models/text/text";

import { Router, Request, Response } from "express";
const router = Router();

import { textEncrypt, textDecrypt } from "../util/encryption";

// Saving text route

router.route("/save").post((req: Request, res: Response): void => {
    console.log("/text/save - Saving text...");
    console.log("/text/save - Received text: ", req.body.text);

    const { encryptedText, iv } = textEncrypt("aes-192-cbc", req.body.text)

    new TextModel({
        textEncryption: encryptedText,
        iv
    })
        .save()
        .then(savedText => {

            console.log("/text/save - Successfully saved...");

            res.status(200).json({
                received: true,
                savedText
            });

            return;
        })
        .catch(error => {
            console.log("/text/save - Error saving document!", error);

            res.status(400).json({
                status: 400,
                error
            });
        });

});

// Getting encrypted text route

router.route("/get").get((req: Request, res: Response) => {

    TextModel.find({
        _id: req.body.id
    })
        .then(textObject => {

            if (textObject.length == 0) {
                res.status(404).json({
                    message: "Nothing found from query!",
                    found: null,
                    textObject
                })

                return;
            }

            const text: Text = textObject[0];
            const decryptedText = textDecrypt("aes-192-cbc", text.textEncryption, text.iv)

            res.status(200).json({
                decryptedText
            });

        })
        .catch(err => console.log(err));

});

router.route("/get/all").get(async (req: Request, res: Response) => {

    TextModel.find()
        .then(encryptedTexts => {

            if (encryptedTexts.length > 0) {
                res.status(200).send(encryptedTexts)

                return;
            }

            res.send([])

        })
        .catch(error => {

            res.status(400).json({
                message: "Could not get the documents",
                error,
            })

        })


})

router.route("/delete/:id").delete(async (req: Request, res: Response) => {

    const { id } = req.params;

    TextModel.deleteOne({
        _id: id
    })
        .then(deleted => {

            res.status(200).json({
                deleted
            })

            return;
        })
        .catch(error => {

            res.status(400).json({
                isDeleted: false,
                error
            })
        })
})

export = router;
