<template>
  <div class="bg">
    <div class="top-left" />
    <div class="top-right" />
    <div class="bottom-left" />
    <div class="bottom-right" />
    <slot />
  </div>
</template>

<script>
export default {

}
</script>
<style scoped lang="less">
.bg {
  padding: 20px;
  position: relative;
  background-color: rgba(11, 62, 104, 0.3);
  border: 2px solid #063948;
  box-shadow: inset 2px 2px 20px #052a48 ,inset -5px -2px 20px #052a48 ,inset 2px -5px 20px #052a48 ,inset 2px 2px 20px #052a48;
  border-radius: 8px;
  margin-bottom: 18px;
  .top-left, .top-right, .bottom-left, .bottom-right {
    position: absolute;
    width: 24px;
    height: 24px;
    border: solid 2px #02a5ab;
  }
  .top-left {
    border-top-left-radius: 8px;
    top: -2px;
    left: -2px;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  .top-right {
    border-top-right-radius: 8px;
    top: -2px;
    right: -2px;
    border-left-color: transparent;
    border-bottom-color: transparent;
  }
  .bottom-left {
    border-bottom-left-radius: 8px;
    bottom: -2px;
    left: -2px;
    border-right-color: transparent;
    border-top-color: transparent;
  }
  .bottom-right {
    border-bottom-right-radius: 8px;
    bottom: -2px;
    right: -2px;
    border-left-color: transparent;
    border-top-color: transparent;
  }
}
</style>
