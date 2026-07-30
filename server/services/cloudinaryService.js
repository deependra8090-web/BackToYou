async function uploadImage(fileDataOrUrl) {
  if (typeof fileDataOrUrl === 'string' && fileDataOrUrl.startsWith('http')) {
    return { url: fileDataOrUrl, publicId: "cloud_" + Date.now() };
  }
  return {
    url: fileDataOrUrl || "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
    publicId: "cloud_img_" + Date.now()
  };
}

module.exports = { uploadImage };
