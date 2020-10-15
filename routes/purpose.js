const express = require("express");
const router = express.Router();
const passport = require("passport");
const Purpose = require("../models/Purpose");
const User = require("../models/User");
const Task = require("../models/Task");

/**
 * @route get api/purpose/get
 * @desc Get purpose
 * @access Private
 */
router.get(
  "/all",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    try {
      const purposes = await Purpose.findAll({
        attributes: ["id", "name", "description", "done"],
        where: {
          userId: req.user.id,
        },
      });
      return res.status(200).json({
        purposes,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);

/**
 * @route post api/purpose/create
 * @desc Create purpose
 * @access Private
 */
router.post(
  "/add",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    let { name, description } = req.body;
    try {
      //add purpose
      await Purpose.create({
        name: name,
        description: description,
        userId: req.user.id,
      });
      return res.status(201).json({
        status: "success",
        msg: "purpose added!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);

/**
 * @route post api/purpose/done
 * @desc change done status
 * @access Private
 */
router.post(
  "/done",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //access check
      const access = await Purpose.findOne({
        include: {
          model: User,
          where: {
            id: req.user.id,
          },
        },
      });
      if (!access) {
        res.status(403).json({
          msg: "No access",
        });
      }
      //update done status
      await Purpose.update(
        { done: Boolean(req.body.done) },
        {
          where: {
            id: req.body.id,
          },
        }
      );
      res.status(201).json({
        status: "success",
        msg: "Status update!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);

/**
 * @route delete api/purpose/delete
 * @desc delete task
 * @access Private
 */
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //access check
      const access = await Purpose.findOne({
        include: {
          model: User,
          where: {
            id: req.user.id,
          },
        },
      });
      if (!access) {
        res.status(403).json({
          msg: "No access",
        });
      }

      //delete all tasks
      await Task.destroy({
        where: {
          purposeId: req.body.purposeId,
        },
      });

      //delete purpose
      await Purpose.destroy({
        where: {
          id: req.body.purposeId,
        },
      });
      res.status(201).json({
        status: "success",
        msg: "Task deleted!",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);
module.exports = router;
