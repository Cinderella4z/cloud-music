<template>
  <div id="Login"
       ref="login"
       v-if="$store.state.private.ifclick">
    <span class="close"
          @click="close">
      <i class="el-icon-close"></i>
    </span>

    <span class="change">
      <i class="el-icon-user"></i>
    </span>

    <!-- 二维码登录 -->

    <div class="unicode"
         v-if="!getname && changelogin">

      <div class="top">二维码登录</div>
      <img :src="src"
           style="width:240px">
      <div class="bottom"
           @click="loginStatus">选择其他方式登录</div>
    </div>

    <!-- 手机号登录 -->
    <div class="logins"
         v-if="!getname && !changelogin">

      <div class="top">手机号登录</div>
      <div class="input">
        <input type="text"
               placeholder="请输入手机号"
               class="number"
               v-model="phone">
        <div>
          <input type="password"
                 placeholder="请输入密码"
                 class="number"
                 v-model="password">
          <el-button :plain="true"
                     class="submit"
                     @click="login">登 录</el-button>
        </div>

      </div>
      <div @click="loginStatus"
           class="bottom">
        选择其他方式登录
      </div>
    </div>

    <!-- 登录成功界面 -->
    <div v-if="getname"
         class="logined">

      <img :src="getbackgroundUrl">

      <div class="contents">
        <div class="touxiang">
          <img :src="getUrl">
          <div class="top">{{getname}}</div>
          <!-- <div class="follow">
            <span> 关注:{{getfollows}}</span>
            <span> 粉丝:{{getfolloweds}}</span>
          </div> -->
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { getKey, create, check, phoneLogin, account } from '../../network/login'
import { getRecommend } from '../../network/Find/child/find-songs'
import { getLikelist } from '../../assets/js/getLikelist'


export default {
  name: 'Login',
  data () {
    return {
      src: '',
      code: 0,
      phone: '',
      password: '',
      changelogin: true,

    }
  },
  methods: {
    login () {
      phoneLogin(this.phone, this.password).then(res => {
        if (res.data.code !== 400) {
          // 获取推荐歌单

          this.$store.commit('setuid', res.data.account.id)
          this.$store.commit('setbackgroundUrl', res.data.profile.backgroundUrl)
          this.$store.commit('setUrl', res.data.profile.avatarUrl)
          this.$store.commit('setname', res.data.profile.nickname)
          // this.$store.commit('setfollows', res.data.profile.follows)
          // this.$store.commit('setfolloweds', res.data.profile.followeds)
          this.$refs.login.style.display = 'none',
            this.$store.commit('setifclick')
          if (this.$store.state.private.uid !== null) {
            getLikelist(50, 0);
          }

          getRecommend().then(res => {
            this.$store.commit('setRecommend', res.data.recommend.splice(0, 10))
          })

          this.$message({
            message: '登录成功',
            type: 'success'
          });

        }
        else {
          this.$message.error('密码错误');
        }

        // 获取喜欢音乐


      })
    },
    close () {
      this.$refs.login.style.display = 'none'
    },
    loginStatus () {
      this.changelogin = !this.changelogin
    }
  },
  mounted () {
    getKey().then(res => {
      return res.data.data.unikey
    }).then((unikey) => {

      create(unikey, unikey).then(src => {
        this.src = src.data.data.qrimg;
      })

      let timer = setInterval(() => {
        check(unikey).then(res => {
          this.code = res.data.code
          if (this.code === 803) {
            account(encodeURIComponent(res.data.cookie)).then(res => {
              console.log(res);
              this.$store.commit('setuid', res.data.account.id)
              this.$store.commit('setbackgroundUrl', res.data.profile.backgroundUrl)
              this.$store.commit('setUrl', res.data.profile.avatarUrl)
              this.$store.commit('setname', res.data.profile.nickname)
              // this.$store.commit('setfollows', res.data.profile.follows)
              // this.$store.commit('setfolloweds', res.data.profile.followeds)
              getRecommend().then(res => {
                this.$store.commit('setRecommend', res.data.recommend.splice(0, 10))
              })
              this.$refs.login.style.display = 'none',
                this.$store.commit('setifclick')
              if (this.$store.state.private.uid !== null) {
                getLikelist(50, 0);
              }
              this.$message({
                message: '登录成功',
                type: 'success'
              });


            }
            )
          }
        })
      }, 1000)


    })
  },
  computed: {
    getbackgroundUrl () {
      return this.$store.state.private.backgroundUrl + "?param=200y200"
    },
    getUrl () {
      return this.$store.state.private.url + "?param=100y100"
    },
    getname () {
      return this.$store.state.private.name
    },
    getfollows () {
      return this.$store.state.private.follows
    },
    getfolloweds () {
      return this.$store.state.private.followeds
    }
  }

}
</script>

<style scoped>
#Login {
  background-color: #ffffff;
  width: 500px;
  height: 400px;
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 250px);
  z-index: 10;
  border-radius: 30px;
}

.top {
  /* background-color: blue; */
  text-align: center;
  font-size: 25px;
  line-height: 80px;
}
.close {
  display: inline-block;
  color: #9f9f9f;
  font-size: 20px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 10px;
  top: 6px;
  text-align: center;
  z-index: 9;
}
.img {
  width: 250px;
  height: 250px;
  margin: 0 auto;
}
.img img {
  background-size: cover;
  width: 100%;
  height: 100%;
}
.input {
  margin: 0 auto;
  width: 200px;
}
.number {
  width: 200px;
  height: 30px;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 5px;
  outline: none;
  border-radius: 5px;
}
.submit {
  width: 203px;
  height: 30px;
  background-color: #ea4848;
  color: white;
  border-radius: 5px;
  margin-top: 20px;
}
.logins {
  width: 100%;
  height: 100%;
}
.logined {
  width: 100%;
  height: 100%;
  border-radius: 30px;
  position: relative;
}
.logined img {
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
.contents {
  /* background-color: #ea4848; */
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.touxiang {
  width: 300px;
  text-align: center;
  height: 80%;
  margin: 0 auto;
  color: #d0d0d0;

  /* background-color: saddlebrown; */
}
.touxiang img {
  border-radius: 100px;
  height: 150px;
  width: 150px;
}
.follow {
  width: 100%;
  /* background-color: #ea4848; */
  height: 30px;
  font-size: 16px;
  line-height: 30px;
}
.follow span {
  display: inline-block;
  width: 80px;
  /* background-color: #ffffff; */
  font-weight: bolder;
}

.unicode {
  text-align: center;
}
.bottom {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
