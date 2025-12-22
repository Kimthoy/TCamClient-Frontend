import api from "./index";

export const submitApplyCV = async (jobId,formData) => {
  try {
    const res = await api.post(`/jobs/${jobId}/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("submitApplyCV error:", err?.response?.data || err.message);
    throw err;
  }
};
export const getJobById = async (id) => {
  try {
    const res = await api.get(`/jobs/public/${id}`);
    return res?.data?.data || res?.data;
  } catch (err) {
    console.error("getJobById error:", err?.response?.data || err.message);
    throw err;
  }
};
