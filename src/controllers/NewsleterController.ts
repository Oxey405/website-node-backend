import { Request, Response } from "express";

import Core from "../Core.js";
import { questions } from "../util/QuestionData.js";
import { validationResult } from "express-validator";
import yup from "yup";

class NewsletterController {
  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  public async getNewsletters(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.query && req.query.page) {
      let page = parseInt(req.query.page as string);
      const newsletters = await this.core.getPrisma().newsletter.findMany({
        skip: page * 10,
        take: 10,
      });
      let count = await this.core.getPrisma().newsletter.count();
      res.send({ pages: Math.ceil(count / 10), data: newsletters });
    } else {
      const newsletters = await this.core.getPrisma().newsletter.findMany({});
      res.send(newsletters);
    }
  }
  public async getNewsletter(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return await this.core.getPrisma().newsletter.findUnique({
      where: {
        id: req.params.id,
      },
    });
  }
}

export default NewsletterController;
