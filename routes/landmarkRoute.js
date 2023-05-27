import landmarkModel from "../model/landmarkSchema.js";
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import provinceModel from "../model/provincesSchema.js";
const Router = express.Router();

Router.get("/count", async (req, res) => {
    try {
        const result = await landmarkModel.count({}).exec()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    } catch (er) {
        console.log(er)
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
Router.get("/", async (req, res) => {
    try {
        const result = await landmarkModel.find({}, `_id name`).exec();
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND"
        });
    }
});
Router.get("/getAll", async (req, res) => {
    const typeId = req.query.type
    console.log(typeId)
    try {
        const result = await landmarkModel.find({ type: typeId }).exec();
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND"
        });
    }
});
Router.post('/search', async (req, res) => {
    const { search } = req.body;
    try {
        const regex = new RegExp(search, 'i');
        const result = await landmarkModel.find({ name: regex }).exec();
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND"
        });
    }
});
Router.get("/:id", async (req, res) => {
    try {
        const result = await landmarkModel.find({ _id: req.params.id }).exec();
        res.json({
            code: "200",
            message: "OK",
            data: result[0]
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND"
        });
    }
});
Router.post("/route", async (req, res) => {
    const { typeId, provinceArr } = req.body;

    let result = [];
    try {
        for (const province of provinceArr) {
            const provinceResult = await provinceModel.findOne({ name: province }, `_id name`).exec();


            if (typeId) {
                const resLandmark = await landmarkModel.find({ type: typeId, province_id: provinceResult._id }).exec();
                result.push(...resLandmark);
            }
        }


        res.json({
            code: "200",
            message: "OK",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND",
        });
    }
});
Router.post("/favourite", async (req, res) => {
    const { landmarkIdArr } = req.body;

    let result = [];
    try {
        for (const landmarkId of landmarkIdArr) {

            const resLandmark = await landmarkModel.find({ _id: landmarkId }).exec();
            console.log(resLandmark)
            result.push(...resLandmark);
        }


        res.json({
            code: "200",
            message: "OK",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND",
        });
    }
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/landmarks")
    },
})
const upload = multer({ storage: storage })
Router.post("/create", upload.any('images'), async (req, res) => {
    try {
        const imageList = []
        req.files.forEach(async (image, index) => {
            let fileType = image.mimetype.split("/")[1];
            let imgName = req.body.name.trim() + index + "." + fileType;
            imageList.push(imgName)
            await fs.renameSync(
                `./public/images/landmarks/${image.filename}`,
                `./public/images/landmarks/${imgName}`,
            );
        })

        const landmark = new landmarkModel({ ...req.body, images: imageList })
        const result = await landmark.save()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    } catch (ex) {
        console.log(ex);
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
Router.post("/update", async (req, res, next) => { //...?id=
    try {
        const id = req.query.id;
        const landmark = await landmarkModel.findById(id);
        if (!landmark) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        Object.assign(landmark, req.body);
        const result = await landmark.save()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    } catch (ex) {
        console.log(ex);
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
Router.post("/delete", async (req, res) => {
    try {
        const id = req.query.id;
        const deletedLandmark = await productModel.findOneAndDelete({ _id: id });
        if (!deletedLandmark) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        res.json({
            code: "200",
            message: "OK",
            data: deletedLandmark
        });
    } catch (ex) {
        console.log(ex);
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
export default Router;