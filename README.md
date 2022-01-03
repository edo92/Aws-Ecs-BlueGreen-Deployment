<h1 align="center">Aws Ecs Blue Green Deployment</h1>
</br>

<p align="center">
   <img src="https://raw.githubusercontent.com/edo92/Aws-Ecs-BlueGreen-Deployment/main/.assets/basediagram.png"/>
</p>

Aws elastic container service with blue/green deployment.

---

</br>

### Resources

-  [Basic Node Applicaton](https://github.com/edo92/Simple-Express-Server)
-  [Cloud Infrastructure](https://github.com/edo92/Aws-Ecs-BlueGreen-Deployment)

### :key: &nbsp; Github Oauth Token

> #### <i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i> **_Create secret manager for github token_**

```sh
   aws secretsmanager create-secret --name demoapp/gitSourcetoken --secret-string <GITHUB_TOKEN>
```

> Or

```sh
   aws secretsmanager update-secret --secret-id demoapp/gitSourcetoken --secret-string <GITHUB_TOKEN>
```

</br>
