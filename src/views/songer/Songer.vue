<template>
  <div id="Songer">
    <songs :SearchSongs="songs"
           @SongClick="SongClick">

      <span slot="img"><img :src="currentSonger.cover ? currentSonger.cover+'?param=120y120' :currentSonger.picUrl+'?param=120y120'"></span>
      <span slot="tabname">{{currentSonger.name}}</span>
      <div slot="playAll">
        <el-button type="danger"
                   round>▶ 播放全部</el-button>
      </div>
      <span slot="num2">音乐标题</span>
      <span slot="num3">歌手</span>
      <span slot="num4">专辑</span>
      <span slot="num4">时长</span>

      <!-- <div slot="loadMore">加载更多</div> -->
    </songs>
  </div>
</template>

<script>
import Songs from '../../components/content/songs/Songs'

// import { songer } from '../../network/Songer'

export default {
  name: 'Songer',
  data () {
    return {
      currentSonger: ''
    }
  },
  components: {
    Songs
  },
  activated () {
    this.currentSonger = JSON.parse(this.$route.query.currentSonger)
  },

  methods: {
    SongClick () {
      this.$emit('SongClick');
    },
  },
  computed: {
    songs () {
      return this.$store.state.songer
    }

  }

}
</script>

<style scoped>
#Songer {
  font-size: 0px;
  display: inline-block;
  width: 85%;
}
</style>
