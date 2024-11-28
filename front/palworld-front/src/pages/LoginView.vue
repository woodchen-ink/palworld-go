<template>
  <q-page class="row justify-center">
    <q-card
      class="col-12 col-xs-8 col-sm-6 col-md-4 shadow q-pa-md self-center"
    >
      <q-card-section>
        <div class="text-h5"><q-icon name="login" color="accent" /> 登录</div>
      </q-card-section>
      <q-separator />
      <q-form
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit.prevent="login"
        @reset="clearForm"
      >
        <q-card-section class="q-gutter-md">
          <q-input v-model="state.username" filled clearable label="用户名" required>
            <template v-slot:prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            v-model="state.password"
            type="password"
            filled
            clearable
            label="密码"
            required
          >
            <template v-slot:prepend><q-icon name="lock" /></template>
          </q-input>
        </q-card-section>
        <q-separator />
        <q-card-actions class="justify-center">
          <q-btn flat color="positive" type="submit" icon="check">登录</q-btn>
          <q-btn flat color="negative" type="reset" icon="clear">清除</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import api from '../api/api';

interface LoginState {
  isLoggedIn: boolean;
  username: string;
  password: string;
  loginError: string;
  loading: boolean;
}

// 使用接口定义状态
const state = ref<LoginState>({
  isLoggedIn: false,
  username: '',
  password: '',
  loginError: '',
  loading: false
});

const $router = useRouter();
const $q = useQuasar();

// 登录方法
const login = async () => {
  if (!state.value.username || !state.value.password) {
    $q.notify({
      color: 'warning',
      message: '请输入用户名和密码',
      icon: 'warning'
    });
    return;
  }

  state.value.loading = true;
  try {
    const loginResponse = await api.loginApi(
      state.value.username,
      state.value.password
    );
    
    if (loginResponse.isLoggedIn) {
      state.value.isLoggedIn = true;
      $q.notify({
        color: 'positive',
        message: '登录成功',
        icon: 'check_circle'
      });
      void $router.push('/index');
    }
  } catch (err) {
    state.value.loginError = '登录失败，请检查用户名和密码。请查看程序命令行窗口输出的默认用户名密码。';
    $q.notify({
      color: 'negative',
      message: state.value.loginError,
      icon: 'error'
    });
  } finally {
    state.value.loading = false;
  }
};

// 清除表单
const clearForm = () => {
  state.value.username = '';
  state.value.password = '';
  state.value.loginError = '';
};

// 检查登录状态
const checkLoggedIn = async () => {
  try {
    const loginStatus = await api.checkLoginStatus();
    state.value.isLoggedIn = loginStatus.isLoggedIn;
    if (state.value.isLoggedIn) {
      void $router.push('/index');
    }
  } catch (err) {
    console.error('Error checking login status:', err);
    state.value.isLoggedIn = false;
  }
};

// 生命周期钩子
onMounted(() => {
  void checkLoggedIn();
});
</script>

<style scoped>
.q-card {
  max-width: 400px;
  width: 100%;
}
</style>
