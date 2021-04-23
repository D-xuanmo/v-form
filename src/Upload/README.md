# 上传文件组件

## Params
|参数|描述|类型|默认值|
|---|---|---|---|
|action|上传文件的接口地址|string|-|
|accept|文件类型，原生`input`属性|string|-|
|limit|最大上传文件数量|number|-|
|multiple|是否允许多选|boolean|false|
|disabled|是否禁用|boolean|false|
|name|后台接收文件的字段名|string|file|
|headers|上传文件附加的请求头参数|object|{}|
|data|上传文件时附加的数据|object|{}|
|props|用于自定义字段，具体参数看后续文档|object|{}|
|onSuccess|上传上传成功之后渲染组件之前执行的函数，回调的第一个参数是本次请求的`response`，需要返回用于渲染组件的参数|function|-|

## Events
|事件|描述|回调参数|
|---|---|---|
|file-exceed|大于文件上传的最大个数|(value:当前组件的值)|
|file-change|选择完文件触发|(file:选择的文件)|
|file-before-upload|上传文件之前执行|(file:当前选择的文件)|
|file-success|文件上传成功|(response, fileList)|
|file-error|文件上传失败|{ status, statusText }|
|file-remove|删除一个文件|(file:被删除的文件, fileList)|

## Props
|参数|描述|类型|默认值|
|---|---|---|---|
|url|组件渲染列表默认用的url，可指定字段替换|string|-|