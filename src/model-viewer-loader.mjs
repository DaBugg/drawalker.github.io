let modelViewerLoadPromise = null;

window.loadNetworksNodesModelViewer = () => {
  if (customElements.get("model-viewer")) return Promise.resolve();
  if (!modelViewerLoadPromise) {
    modelViewerLoadPromise = import("@google/model-viewer")
      .then(() => customElements.whenDefined("model-viewer"))
      .catch((error) => {
        modelViewerLoadPromise = null;
        throw error;
      });
  }
  return modelViewerLoadPromise;
};

window.dispatchEvent(new Event("networks-nodes-model-viewer-loader-ready"));
