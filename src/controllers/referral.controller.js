const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { User, Referral, ReferralAmount } = require("../models");

const claimed = catchAsync(async (req, res) => {
  let referralAmount = await ReferralAmount.findOne();
  // console.log("referralAmount", referralAmount.amount);
  const user = await User.findOne({ _id: req.user._id });
  const referralCode = req.body.referralCode;

  // Find the user with the referral code
  const claimedUser = await User.findOne({ referralCode });


  // Check if referral has already been claimed
  const referralClaimed = await Referral.findOne({ referralCode, userId: req.user._id });
  
  // check if user not approved so can't claim

  if (user.nidStatus !== "approved") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Your NID not approved yet");
  }
  if (referralClaimed) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Referral Already Claimed");
  }

  // Check if claimedUser exists
  if (!claimedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Referral Code");
  }

  // Create Referral document
  const referral = await Referral.create({
    userId: req.user._id,
    claimedUserId: claimedUser._id,
    referralCode: referralCode,
  });

  // Update user and claimedUser
  user.claimedReferralCode = referralCode;
  user.referralClaimed = true;
  await user.save();

  console.log("claimedUser amound", referralAmount.amount);

  // Increment claimedUser's rand
  claimedUser.rand += referralAmount.amount;
  await claimedUser.save();

  return res.status(httpStatus.OK).json(
    response({
      message: "Referral Claimed",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const  myReferrals = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const referrals = await Referral.find({ claimedUserId: user._id }).populate("userId").select("-createdAt -updatedAt -__v");
  const totalReferrals = await Referral.countDocuments({ claimedUserId: user._id });
  return res.status(httpStatus.OK).json(
    response({
      message: "My Referrals",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {referrals, totalReferrals},
    })
  );
});

const addReferralAmount = catchAsync(async (req, res) => {
  let existingReferralAmount = await ReferralAmount.findOne();

  if (existingReferralAmount) {
    // Update existing referral amount
    existingReferralAmount.amount = req.body.amount;
    await existingReferralAmount.save();
  } else {
    // Create new referral amount if it doesn't exist
    existingReferralAmount = await ReferralAmount.create({
      amount: req.body.amount
    });
  }

  return res.status(httpStatus.OK).json(
    response({
      message: existingReferralAmount ? "Referral Amount Updated" : "Referral Amount Added",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const getReferralAmount = catchAsync(async (req, res) => {
  const referralAmount = await ReferralAmount.findOne();
  return res.status(httpStatus.OK).json(
    response({
      message: "Referral Amount",
      status: "OK",
      statusCode: httpStatus.OK,
      data: referralAmount,
    })
  );
});


module.exports = {
  claimed,
  myReferrals,
  addReferralAmount,
  getReferralAmount
};
