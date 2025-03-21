import { Request, Response } from "express";

const ProfileController = {
  index: (req: Request, res: Response) => {

    if(!req.isAuthenticated()) {
      res.redirect('/login')
    }
    res.status(200).json({ user: req.user });

  }
}

export default ProfileController;
