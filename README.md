# project-v-api-proxy

其實就是拿 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 搭配 [express.js](https://expressjs.com/zh-tw/) 簡單組一個 mock & proxy 的 server 出來用而已，這個功能本身沒有很複雜。

## 如何使用 proxy 的功能

1. 當然就是先將這個專案 pull 下來
2. 安裝套件，執行 `npm install`
3. 建立 `.env` 檔，可以參考 `.env.example` ，裡面有說明這兩個環境變數的作用
4. 建立 `.router.json` 檔，可以參考 `.router.json.example` ，這個檔案是在設定你的 host 與目標 server host 的對應表，而這個映射功能的時限是依靠 `http-proxy-middleware` 的 router option 來實現的，所以具體可以怎麼映射，可以參考他們的[官方文件](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/router.md)。
5. 接下來就是啟動服務了，執行 `node index.js`。

## 如何使用 mock 的功能

只需要在 mock 資料夾裡面建立對應路徑的檔案即可。

比方說你要 mock 的 api 路徑是 `/demo/posts`，
那你只需要在 mock 資料夾下建立 `demo/posts.json` 即可，
這個服務會自行判斷對應路徑是否存在著 mock file，有的話就會拿來用，並直接將 json 檔輸出，
沒有的話就會選擇做 proxy 到 target 去。

如果你有使用多 target 映射的設定，就可以根據不同的 host 來建立不同的對應 mock file，
比方說你想要 mock host （不是 target 喔）是 `localhost:3050` 的 `/demo/posts`，
那你只需要在 mock 資料夾下建立 `localhost:3050/demo/posts.json` 的檔案即可，
這個服務會自行判斷對應路徑是否存在著 mock file，有的話就會拿來用，並直接將 json 檔輸出，
沒有的話就會選擇做 proxy 到 target 去。

程式在判斷的順序上，會優先看是否有對應 host 資料夾的對應檔案，
找不到時才會忽略 host 資料夾，直接去 mock 找對應 path 的 mock file，
所以兩種方式是可以共存的，只是要注意路徑有衝突的狀況而已。

## 如何在單個 local 服務裡實現多個 target 的映射

這個涉及的知識跟內容有點多，這邊只簡單的給粗略的方向。
簡單來說，可以嘗試利用 nginx 的反向代理，搭配修改 local 環境的 `/etc/hosts`，來讓同一個 local service 同時可以做到多個 target 映射的功能。
