export const get_adjust_img_url = (img_url, angle) => {
  let new_img_url = ''

  const target_img = new Image()
  target_img.src = img_url

  return new Promise((resolve) => {
    target_img.onload = async () => {
      const orientation = await get_image_angle(target_img)

      if (angle) {
        new_img_url = generate_adjust_img_url(target_img, null, angle)
      } else {
        if (!orientation) {
          // orientation is undefined or 0
          new_img_url = img_url
        } else {
          // orientation is 3, 6, 8
          new_img_url = generate_adjust_img_url(target_img, orientation)
        }
      }

      resolve(new_img_url)
    }
  })
}

const generate_adjust_img_url = (target_img, orientation, angle) => {
    const canvas = document.createElement("CANVAS")
    const ctx = canvas.getContext("2d")

    const adjust_angle = angle || get_adjust_angle(orientation)
    const is_90 = Math.abs(adjust_angle) === 90

    canvas.width = is_90 ? target_img.height * 0.5 : target_img.width * 0.5
    canvas.height = is_90 ? target_img.width * 0.5 : target_img.height * 0.5
    ctx.rotate(adjust_angle * Math.PI / 180)
    switch(adjust_angle) {
      case 90 :
        ctx.translate(0, -canvas.width)
        break
      case -90 :
        ctx.translate(-canvas.height, 0)
        break
      case 180 :
        ctx.translate(-canvas.width, -canvas.height)
        break
    }
    ctx.drawImage(
      target_img,
      0,
      0,
      target_img.width * 2,
      target_img.height * 2,
      0,
      0,
      target_img.width,
      target_img.height
    )

    return canvas.toDataURL()
}

const get_adjust_angle = orientation => {
  const new_orientation = (typeof orientation !== 'undefined') ? orientation : 0

  switch (new_orientation) {
    case 3:
      return 180
      break

    case 6:
      return 90
      break

    case 8:
      return -90
      break

    default:
      return 0
  }
}

const get_image_angle = img_ref => (
  new Promise((resolve) => {
    EXIF.getData(img_ref, () => {
        const orientation = EXIF.getTag(img_ref, 'Orientation')
        resolve(orientation)
     })
  })
)

import EXIF from 'exif-js/exif.js'
