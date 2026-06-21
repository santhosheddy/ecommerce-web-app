const express = require("express");
const router = express.Router();

const Address =
require("../models/Address");

router.get("/:userId",
async (req,res)=>{

  const address =
  await Address.findOne({
    userId:req.params.userId
  });

  res.json(address);
});

router.post("/save",
async (req,res)=>{

  const {
    userId,
    fullName,
    mobile,
    city,
    pincode,
    address,
  } = req.body;

  const existing =
  await Address.findOne({
    userId,
  });

  if(existing){

    existing.fullName=
    fullName;

    existing.mobile=
    mobile;

    existing.city=
    city;

    existing.pincode=
    pincode;

    existing.address=
    address;

    await existing.save();

    return res.json(existing);
  }

  const newAddress =
  await Address.create(req.body);

  res.json(newAddress);
});

module.exports = router;