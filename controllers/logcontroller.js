const router = require("express").Router();
const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models")

router.post("/", validateJWT, async (req, res) => {
    const {description, definition, result} = req.body
    const {id} = req.user
    try {
        const Log = await LogModel.create({
            description,
            definition,
            result,
            owner_id: id
        })
        res.status(201).json ({
            message: "log created",
            Log,
        });
    } catch (e) {
        res.status(500).json({
            error: e 
        });
    }
});


router.get("/", async (req, res) => {
    try{
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
})
router.get("/:id", validateJWT, async (req, res) => {
    const {id} = req.user
    try {
        const LocatedLog = await LogModel.findOne({
            where: {
                id: req.params.id
            },
        });
        res.status(200).json({
            message: "Log succesfully retrieved",
            LocatedLog,
        });
    }   catch (e) {
        res.status(500).json({
            message: `Failed to retrieve log: ${e}`
        })
    }
})


router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body;
    const logId = req.params.id;
    const userId = req.user.id;
    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };
    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
    };
    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json({
            message: "log succesfully updated",
            update
        });
    } catch (e) {
        res.status(500).json({
            error: e
        })
    }
})


router.delete("/:id", validateJWT, async (req, res) => {
    try {
        const deletedLog = await LogModel.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            message: "Log entry removed",
            deletedLog,
        });
    } catch (e) {
        res.status(500).json({
            message: "Failed to retrieve log",
            error: e
        })
    }
})
module.exports = router;