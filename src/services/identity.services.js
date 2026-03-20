/* ================= LOCAL VALIDATION ================= */

// Basic format validation
export const validateBVN = (bvn) => {
  return /^\d{11}$/.test(bvn);
};

export const validateNIN = (nin) => {
  return /^\d{11}$/.test(nin);
};

/* ================= FRAUD CHECK ================= */

export const detectFraud = async (Bursary, { email, bvn, nin }) => {
  const existing = await Bursary.findOne({
    $or: [{ email }, { bvn }, { nin }],
  });

  return !!existing; // true = fraud
};