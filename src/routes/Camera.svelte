<script>
  import { onMount, onDestroy } from "svelte";
  import { PoseEstimator } from "$lib/pose-estimation.js";

  export let onPose;

  let videoElement;
  let isCameraActive = false;
  let stream;
  let animationFrame;
  let lastVideoTime = -1;
  let lastPose = null;
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
      if (!isCameraActive) return;
      predictPose();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      // Stop all tracks in the stream
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      // Set the video source to null, clearing the video stream
      videoElement.srcObject = null;

      // Pause the video and reset the playback position
      videoElement.pause();
      videoElement.currentTime = 0;

      // Mark camera as inactive
      isCameraActive = false;
      cancelAnimationFrame(animationFrame);
    }
  };

  onMount(() => {
    startCamera();

    // Cleanup when component is destroyed
    onDestroy(() => {
      stopCamera();
      estimator.close();
    });
  });
</script>

<div
  class="flex flex-col items-center justify-center w-full h-screen bg-gray-900 gap-2"
>
  <div class="inline-flex items-center gap-2">
    <img src="/baboon.svg" alt="logo" class="h-12 w-12" />
    <p class="font text-2xl">baboon</p>
  </div>
  <div class="relative w-full h-screen">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      bind:this={videoElement}
      autoplay
      playsinline
      class="w-full h-full object-cover"
    ></video>

    <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2">
      {#if isCameraActive}
        <button
          on:click={stopCamera}
          class="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-lg"
        >
          Stop Camera
        </button>
      {:else}
        <button
          on:click={startCamera}
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg"
        >
          Start Camera
        </button>
      {/if}
    </div>
  </div>
</div>
