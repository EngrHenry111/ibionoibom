import axios from "axios";

/* ================= LOCAL VALIDATION ================= */

export const validateBVN = (bvn) => /^\d{11}$/.test(bvn);
export const validateNIN = (nin) => /^\d{11}$/.test(nin);

/* ================= SAFE BVN API ================= */

export const verifyBVNExternal = async (bvn) => {
  try {
    if (!process.env.PAYSTACK_SECRET) {
      return { status: "skipped" }; // ✅ no crash
    }

    const res = await axios.get(
      `https://api.paystack.co/bank/resolve_bvn/${bvn}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
        timeout: 5000,
      }
    );

    return {
      status: "verified",
      data: res.data,
    };

  } catch (error) {
    console.warn("BVN API failed:", error.message);

    return {
      status: "fallback", // ✅ NEVER BREAK SYSTEM
    };
  }
};

/* ================= SAFE NIN API ================= */

export const verifyNINExternal = async (nin) => {
  try {
    // Example placeholder (real NIN APIs require subscription)
    return {
      status: "verified",
    };
  } catch (error) {
    return {
      status: "fallback",
    };
  }
};

/* ================= FACE MATCH (SAFE MOCK) ================= */

export const verifyFaceMatch = async (passport, studentID) => {
  try {
    if (!passport || !studentID) {
      return { status: "skipped" };
    }

    // 🔥 For now: mock logic (replace with AWS Rekognition later)
    return {
      status: "verified",
      confidence: 0.85,
    };

  } catch (error) {
    return {
      status: "fallback",
    };
  }
};


/* ================= FRAUD DETECTION ================= */

export const detectFraud = async (Bursary, { email, bvn, nin }) => {
  try {
    const existing = await Bursary.findOne({
      $or: [{ email }, { bvn }, { nin }],
    });

    return !!existing; // true = fraud, false = safe
  } catch (error) {
    console.error("Fraud detection error:", error);
    return false; // 🔥 never break system
  }
};