const express = require("express");
const router = express.Router();
const passport = require("passport");
const Purpose = require("../models/Purpose");
const Task = require("../models/Task");
const User = require("./../models/User");

/**
 * @route get api/task/get
 * @desc Get task
 * @access Private
 */
router.get(
  "/all",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    try {
      const purposes = await Task.findAll({
        attributes: ["id", "name", "description", "done"],
        include: {
          model: Purpose,
          attributes: [],
          where: {
            id: req.query.purpose,
          },
          include: {
            model: User,
            attributes: [],
            where: {
              id: req.user.id,
            },
          },
        },
      });
      return res.status(200).json({
        purposes,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);

/**
 * @route post api/task/add
 * @desc add task to purpose
 * @access Private
 */
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { name, description, purposeId } = req.body;
    try {
      //access check
      const access = await Task.findOne({
        include: {
          model: Purpose,
          where: {
            id: purposeId,
          },
          include: {
            model: User,
            where: {
              id: req.user.id,
            },
          },
        },
      });

      if (!access) {
        res.status(403).json({
          msg: "No access",
        });
      }
      await Task.create({
        name: name,
        description: description,
        purposeId: purposeId,
      });
      return res.status(201).json({
        status: "success",
        msg: "task added!",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);

/**
 * @route post api/task/done
 * @desc change task status
 * @access Private
 */
router.post(
  "/done",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //access check
      const access = await Task.findOne({
        include: {
          model: Purpose,
          where: {
            id: req.purposeId,
          },
          include: {
            model: User,
            where: {
              id: req.user.id,
            },
          },
        },
      });
      if (!access) {
        res.status(403).json({
          msg: "No access",
        });
      }
      //update done status
      await Task.update(
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
      console.error(err);
      res.status(500).json({
        status: "error",
        msg: "Server error, please try again or back later",
      });
    }
  }
);

/**
 * @route delete api/task/delete
 * @desc delete task
 * @access Private
 */
router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      //access check
      const access = await Task.findOne({
        include: {
          model: Purpose,
          where: {
            id: req.body.purposeId,
          },
          include: {
            model: User,
            where: {
              id: req.user.id,
            },
          },
        },
      });
      if (!access) {
        res.status(403).json({
          msg: "No access",
        });
      }

      //delete task
      await Task.destroy({
        where: {
          id: req.body.taskId,
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
