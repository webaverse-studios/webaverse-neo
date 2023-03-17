export async function img2img(
  params = {
    init_images: [''],
    resize_mode: 0,
    denoising_strength: 0.5,
    image_cfg_scale: 0,
    mask: '',
    mask_blur: 4,
    inpainting_fill: 0,
    inpaint_full_res: true,
    inpaint_full_res_padding: 0,
    inpainting_mask_invert: 0,
    initial_noise_multiplier: 0,
    prompt: '',
    styles: [''],
    seed: -1,
    subseed: -1,
    subseed_strength: 0,
    seed_resize_from_h: -1,
    seed_resize_from_w: -1,
    sampler_name: 'string',
    batch_size: 1,
    n_iter: 1,
    steps: 50,
    cfg_scale: 7,
    width: 512,
    height: 512,
    restore_faces: false,
    tiling: false,
    do_not_save_samples: false,
    do_not_save_grid: false,
    negative_prompt: '',
    eta: 0,
    s_churn: 0,
    s_tmax: 0,
    s_tmin: 0,
    s_noise: 1,
    override_settings: {},
    override_settings_restore_afterwards: true,
    script_args: [],
    sampler_index: 'Euler',
    include_init_images: false,
    script_name: '',
    send_images: true,
    save_images: false,
    alwayson_scripts: {},
  }
) {
  const url = 'https://stable-diffusion.webaverse.com/sdapi/v1/img2img'
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(params),
  })
  const data = await response.json()
  console.log('img2img data', data)
  return data.images
}
