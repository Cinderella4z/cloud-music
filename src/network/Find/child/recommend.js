import { request } from '../../request'


export function getRecommend (limit) {

  return request({
    url: '/top/playlist/highquality',
    params: {
      limit
    }
  })

}