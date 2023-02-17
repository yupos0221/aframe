#!/usr/bin/python3

from selenium import webdriver
from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome import service as fs
import time

# Chromeのオプション
options = ChromeOptions()
options.add_argument('-headless')
options.add_argument('--use-fake-ui-for-media-stream')
options.add_argument('ignore-certificate-errors')
# options.add_argument("--disable-notifications")
options.add_experimental_option('prefs', {
    "profile.default_content_setting_values.media_stream_mic": 1,     # 1:allow, 2:block 
    "profile.default_content_setting_values.media_stream_camera": 1, # 1:allow, 2:block 
    "profile.default_content_setting_values.geolocation": 2,         # 1:allow, 2:block 
    "profile.default_content_setting_values.notifications": 2         # 1:allow, 2:block 
})

# capabilities = DesiredCapabilities.CHROME.copy()
# capabilities['acceptInsecureCerts'] = True

# Chromedriverのパスを指定
chrome_service = fs.Service(executable_path='/usr/bin/chromedriver') 
driver = webdriver.Chrome(service=chrome_service, options=options)
# driver = Chrome(executable_path='/usr/bin/chromedriver', options=options)
# driver = Chrome(executable_path='/usr/bin/chromedriver', options=options, desired_capabilities=capabilities)
# url = 'https://raspberrypi4/base_server.html'
url = 'https://raspberrypi4/raspberry.html'
 
try:
  driver.get(url)
  print("get url")
  # 画面表示を最大5秒まで待つ
  driver.implicitly_wait(5)
  print("open web page")
  
  wait = WebDriverWait(driver, 5)
  # ボタンをクリック
  # get_device_button = driver.find_element(By.ID,'get_device_button')
  get_device_button = wait.until(expected_conditions.element_to_be_clickable((By.ID,'get_device_button')))
  get_device_button.click()
  print("click get device button")
  # wait = WebDriverWait(driver, 10)

  start_video_button = wait.until(expected_conditions.element_to_be_clickable((By.ID,'start_video_button')))
  start_video_button.click()
  print("click start video button")
  driver.implicitly_wait(5)
  
  # join_room_button = driver.find_element(By.ID,'join_room_button')
  join_room_button = wait.until(expected_conditions.element_to_be_clickable((By.ID,'join_room_button')))
  join_room_button.click()
  print("click join room button")
  driver.implicitly_wait(5)

  # 検索結果のタイトルを取得して出力
  

except:
  import traceback
  traceback.print_exc()

finally:
  # Chromeを終了
  input("何かキーを押すと終了します...")
  # スクリーンショットを保存
  driver.save_screenshot('chromium_search.png')
  driver.quit()