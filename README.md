# project-v-api-proxy

其實就是拿 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 搭配 [express.js](https://expressjs.com/zh-tw/) 簡單組一個 mock & proxy 的 server 出來用而已，這個功能本身沒有很複雜。

## 如何使用

1. 當然就是先將這個專案 pull 下來
2. 安裝套件，執行 `npm install`
3. 建立 `.env` 檔，可以參考 `.env.example` ，裡面有說明這兩個環境變數的作用
4. 建立 `.router.json` 檔，可以參考 `.router.json.example` ，這個檔案是在設定你的 host 與目標 server host 的對應表，而這個映射功能的時限是依靠 `http-proxy-middleware` 的 router option 來實現的，所以具體可以怎麼映射，可以參考他們的[官方文件](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/router.md)。
5. 接下來就是啟動服務了，執行 `node index.js`。

## 如何在單個 local 服務裡實現多個 target 的映射

這個涉及的知識跟內容有點多，這邊只簡單的給粗略的方向。
簡單來說，可以嘗試利用 nginx 的反向代理，搭配修改 local 環境的 `/etc/hosts`，來讓同一個 local service 同時可以做到多個 target 映射的功能。
