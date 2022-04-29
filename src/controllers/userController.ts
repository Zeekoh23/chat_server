import multer from "multer";
import sharp from "sharp";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import CatchAsync from "../utils/CatchAsync";
import { APIFeatures } from "../utils/APIFeatures";
import { ErrorHandling } from "../utils/ErrorHandling";
import { deleteOne, updateOne, getOne, getAll } from "../utils/HandlerFactory";

const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el: any) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);
    console.log(req.body);

    if (req.body.password || req.body.passwordConfirm) {
      return next(new ErrorHandling("This routes is not for password", 400));
    }

    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser: any = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getAllExceptLoggedUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction, user: any) => {
    const users = await User.find({ _id: { $ne: user._id } });
    res.status(200).json({
      ...users,
    });
  }
);

export const getAllUsers = getAll(User);

export const DeleteUser = deleteOne(User);

//do not update passwords
export const updateUser = updateOne(User);
export const UpdateUser1 = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneAndUpdate(
      { number: req.params.number },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new ErrorHandling("No document found with that time", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const getUser = getOne(User);

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ErrorHandling("Not image! We accept only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
    next();
  }
);
