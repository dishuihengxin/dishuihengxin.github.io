# 使用 USB Serial Port连接树莓派系统


树莓派开发的硬件上连接的 WiFi 有问题时，导致不能通过正常的 SSH 方式连接进去，在实际操作过程中就遇到这个问题，针对这我们可以采用 UBS 串口直连的方式进入系统。

<!-- more -->

1. 找到 USB serial 串口的端口：设备管理器-->串口(COM 和 LPT)-->USB serial Port

![](https://res.cloudinary.com/kalid/image/upload/blog/img/win-com-port.png)

2. 根据找到的 USB 串口，使用 PUTTY serial 模式来连接终端

![](https://res.cloudinary.com/kalid/image/upload/blog/img/putty-serial-set.png)

3. 进入后在 putty 上需要敲一下“回车键”切换至 debug 界面，通过 `help` 获取 command 帮助：

![](https://res.cloudinary.com/kalid/image/upload/blog/img/serial-help.png)


4. 输入 `console` 切换到登陆模式，此时输入账户密码就可以正常登入服务器了。


