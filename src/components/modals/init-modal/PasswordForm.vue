<template>
  <div>
    <b-form-text id="error-password-wrong" v-if="errorWrongPassword">
      <b-alert variant="danger" show>Password is wrong!</b-alert>
    </b-form-text>

    <b-form-text id="error-passwords-no-match" v-if="errorPasswordsNoMatch">
      <b-alert variant="danger" show>Passwords don't match!</b-alert>
    </b-form-text>

    <b-form-group 
      label="Your password:" 
      label-for="input-password"
      aria-describedby="password-hint error-password-wrong">
      <b-form-input
        id="input-password"
        ref="input-password"
        type="password"
        v-model="password"
        placeholder="***"
        @keydown.enter="null">
      </b-form-input>
    </b-form-group>

    <b-form-group 
      v-if="createPwdMode"
      label="Confirm your password:" 
      label-for="input-password-confirmation">
      <b-form-input 
        id="input-password-confirmation" 
        type="password"
        v-model="passwordConf"
        placeholder="***"
        @keydown.enter="null">
      </b-form-input>                  
    </b-form-group>

    <b-form-text id="password-hint">
      <b>Please note:</b> Your password is used to encrypt your personal data. <br/> We cannot recover it in case you forgot it.
    </b-form-text>    
  </div>  
</template>

<script>
import Crypt from "../../../model/Crypt.js";

export default {
  data: () => {
    return {
      password: "",
      passwordConf: "",
      errorWrongPassword: false,
      errorPasswordsNoMatch: false,
    }
  },
  props: ["createPwdMode"],
  mounted() {
  },
  methods: {
    createPwd(e, callback) {
      e.preventDefault();
      if (this.password !== this.passwordConf) {
        this.errorPasswordsNoMatch = true;
        return;
      }
      Crypt.generateKeyPair(this.password, () => callback());
    },
    checkPwd(e, callback) {
      e.preventDefault();
      Crypt.decryptPrivateKey(this.password, (result) => {
        if (result) {
          callback();
        } else {
          this.errorWrongPassword = true;
        }
      })
    },
    resetForm() {
      this.password = "";
      this.passwordConf = "";
      this.errorWrongPassword = false;
      this.errorPasswordsNoMatch = false;
    },
  },
}
</script>