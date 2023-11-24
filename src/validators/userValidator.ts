import Joi from "joi";

let joi =Joi

export const regUserValidation = Joi.object({
    fullName: Joi.string().required().min(3).max(30),
    email : Joi.string().required().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ke']
        }
    }),
    password: Joi.string().required().pattern(
        new RegExp('^[a-zA-Z0-9!@#$%^&*()]{3,30}$')
    )
})

export const loginUserValidation=Joi.object({
    email: Joi.string().required().email({
        minDomainSegments:2, tlds:{
            allow: ['com', 'ke']
        }
    }),
    password: Joi.string().required().pattern(
        new RegExp('^[a-zA-Z0-9!@#$%^&*()]{3,30}$')
    )

})




export const userRegisterValidationSchema = Joi.object({
    userName: joi.string().required().min(2).max(30),
    email: joi.string().email({
      minDomainSegments: 1,
      tlds: {
        allow: ["com"],
      },
    }),
    phone_no: joi.string().required().min(10).max(10),
    password: joi
      .string()
      .required()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9!@#%$&*()]{0,30}$")),
  });
  
  export const userLoginValidationSchema = joi.object({
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: {
        allow: ["ke", "com"],
      },
    }),
    password: joi
      .string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9!@#%$&*()]{0,30}$")),
  });
  
  export const validateUserEmail = joi.object().keys({
    email: joi.string().email().required(),
  });