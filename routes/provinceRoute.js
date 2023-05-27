import landmarkModel from "../model/landmarkSchema.js";
import provinceModel from "../model/provincesSchema.js";
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
const Router = express.Router();

Router.get("/count", async (req, res) => {
    try {
        const result = await provinceModel.count({}).exec()
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
        const result = await provinceModel.find({}, `_id name`).exec();
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
        const result = await provinceModel.find({ name: regex }).exec();
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

        const result = await provinceModel.findOne({ _id: req.params.id }).exec();

        const count = await landmarkModel.countDocuments({ province_id: req.params.id }).exec();

        // const updatedResult = [...result, { totalLandmark: count }];
        const resultUpdated = { ...result._doc, totalLandmark: count }

        // result.add({ totalLandmark: count })
        res.json({
            code: "200",
            message: "OK",
            data: resultUpdated
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: "404",
            message: "NOT FOUND"
        });
    }
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/provinces")
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
                `./public/images/provinces/${image.filename}`,
                `./public/images/provinces/${imgName}`,
            );
        })

        const province = new provinceModel({ ...req.body, images: imageList })

        const result = await province.save()
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
        const province = await provinceModel.findById(id);
        if (!province) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        Object.assign(province, req.body);
        const result = await province.save()
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
        const delProvince = await provinceModel.findOneAndDelete({ _id: id });
        if (!delProvince) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        res.json({
            code: "200",
            message: "OK",
            data: delProvince
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