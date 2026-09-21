<template>
  <div class="oauth-background">
    <div id="preloader_6">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores";
import { MeAPI } from "@/api";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
onMounted(() => {
  const platform = route.params.platform as string;
  const code = route.query.code as string;
  const state = route.query.state as string;

  console.log("route", platform, code, state);

  switch (state) {
    case "bind_account":
      MeAPI.bindMeThirdParty({
        platform,
        code,
      })
        .then(() => {
          ElMessage.success("绑定成功");

          userStore.getUserInfo().then(() => {
            if (userStore.userInfo.email === "") {
              ElMessage?.error("请绑定邮箱以便及时收到回复");
            }
          });

          router.push("/mine");
        })
        .catch(() => {
          router.push("/");
        });
      break;
    default:
      userStore
        .thirdLogin({
          platform,
          code,
        })
        .then(() => {
          ElMessage.success("登录成功");

          userStore.getUserInfo().then(() => {
            if (userStore.userInfo.email === "") {
              ElMessage.error("请绑定邮箱以便及时收到回复");
            }
          });

          // 跳转回原页面
          const loginUrl = state;
          if (loginUrl != null && loginUrl !== "") {
            router.push(loginUrl);
          } else {
            router.push("/");
          }
        })
        .catch(() => {
          router.push("/");
        });
  }
});
</script>

<style scoped>
.oauth-background {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: #fff;
}

#preloader_6 {
  position: relative;
  top: 45vh;
  left: 47vw;
  animation: preloader_6 5s infinite linear;
}

#preloader_6 span {
  position: absolute;
  display: block;
  width: 20px;
  height: 20px;
  background: red;
  animation: preloader_6_span 1s infinite linear;
}

#preloader_6 span:nth-child(1) {
  background: #2ecc71;
}

#preloader_6 span:nth-child(2) {
  left: 22px;
  background: #9b59b6;
  animation-delay: 0.2s;
}

#preloader_6 span:nth-child(3) {
  top: 22px;
  background: #3498db;
  animation-delay: 0.4s;
}

#preloader_6 span:nth-child(4) {
  top: 22px;
  left: 22px;
  background: #f1c40f;
  animation-delay: 0.6s;
}

@keyframes preloader_6 {
  from {
    -ms-transform: rotate(0deg);
  }

  to {
    -ms-transform: rotate(360deg);
  }
}

@keyframes preloader_6_span {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
