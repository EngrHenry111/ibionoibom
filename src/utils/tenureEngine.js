import Tenure from "../models/Tenure.js";

/**
 * Ensures only one active tenure per office/department
 * Automatically archives previous tenure
 */
export const enforceSingleActiveTenure = async ({
  office,
  department
}) => {
  const query = { status: "active" };

  if (office) query.office = office;
  if (department) query.department = department;

  await Tenure.updateMany(query, {
    status: "past",
    endDate: new Date()
  });
};
