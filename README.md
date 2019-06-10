This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

I am stupid. I want to see some dicoms in a server, but I have no time to write a server(don't know how). So I use [http-server](https://github.com/indexzero/http-server) as my fileserver, a simple one.

Also react style is stolen from [https://www.udemy.com/react-redux/](https://www.udemy.com/react-redux/)

So if you want to run this demo, you need run http server first on a directory which has two directories:"server" with some dcm files,"masks" with segmentation mask png. And then run this demo. 

Masks segmentation is according to this issue [How to display a bitmap segmentation with brushtool?](https://github.com/cornerstonejs/cornerstoneTools/issues/895)

```
hs -c-1 --cors=Authorization
```

```
npm install
```

```
npm start
```
