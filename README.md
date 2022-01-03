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

### 📜 &nbsp; Aws Credentials

> #### <i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i> **_Export local environmental variables_**

```sh
   export AWS_ACCESS_KEY_ID=<XXXX>
   export AWS_SECRET_ACCESS_KEY=<XXXX>
   export AWS_DEFAULT_REGION=<XXXX>
```

</br>

### ⚙️ &nbsp; Configuration

> #### <i class="fa fa-gear fa-spin fa-2x" style="color: firebrick"></i> **_Configure credentials in config.json_**

```json
    "settings": {
      "applicationName": "<App Name>",
      "familyName": "<Family Name>",
      "clusterName": "<Cluster Name>"
    },

    // React app source code
   "project_source": {
      "branch": "main",
      "owner": "<OWNER>",
      "repo": "<REPO>",
      "secretToken": "<setup in next step>",
    },

    // Cdk infrastructure code
   "cdk_source": {
      "branch": "main",
      "owner": "<OWNER>",
      "repo": "<REPO>",
      "secretToken": "<setup in next step>",
    }
```

</br>

### 🔨 &nbsp; Get Started

-  Install

```js
   npm install
```

-  deploy

```js
   cdk deploy
```

</br>

---
