<script>
  import { onMount, onDestroy } from "svelte";
  import { PoseEstimator } from "$lib/pose-estimation.js";
  export let onPose;
  let videoElement, stream, animationFrame;
  let isCameraActive = false, isModelReady = false, lastVideoTime = -1, lastPose = null;
  const estimator = new PoseEstimator();

  const predictPose = () => {
    if (!isCameraActive || !videoElement) return;
    if (videoElement.currentTime !== lastVideoTime) {
      lastVideoTime = videoElement.currentTime;
      const pose = estimator.predict(videoElement, performance.now());
      if (pose !== undefined) {
        if (pose !== null && pose !== "neut" && pose !== lastPose) onPose(pose);
        lastPose = pose;
      }
    }
    animationFrame = requestAnimationFrame(predictPose);
  };

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      await videoElement.play();
      isCameraActive = true;
      await estimator.initialize();
      isModelReady = true;
      if (isCameraActive) predictPose();
    } catch (error) { console.error("Error accessing webcam:", error); }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    stream = undefined;
    if (videoElement) { videoElement.srcObject = null; videoElement.pause(); videoElement.currentTime = 0; }
    isCameraActive = false;
    cancelAnimationFrame(animationFrame);
  };

  onMount(() => {
    startCamera();
    onDestroy(() => { stopCamera(); estimator.close(); });
  });
</script>

<div class="camera-shell">
  <div class="camera-viewport">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={videoElement} autoplay playsinline></video>
    {#if !isCameraActive}
      <div class="camera-empty"><img src="/baboon-outline.svg" alt="" /><strong>Camera is paused</strong><span>Start the camera when you’re ready to code.</span></div>
    {/if}
    <div class="camera-status" class:ready={isCameraActive && isModelReady}>
      <i></i>{isCameraActive ? (isModelReady ? "Tracking" : "Loading model") : "Offline"}
    </div>
    <span class="frame-corner corner-tl"></span><span class="frame-corner corner-tr"></span>
    <span class="frame-corner corner-bl"></span><span class="frame-corner corner-br"></span>
    <div class="camera-controls">
      <button class:stop={isCameraActive} on:click={isCameraActive ? stopCamera : startCamera}>
        <span class="control-dot"></span>{isCameraActive ? "Stop camera" : "Start camera"}
      </button>
    </div>
  </div>
</div>
