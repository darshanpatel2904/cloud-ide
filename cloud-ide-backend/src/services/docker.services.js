import Dockerode from "dockerode";
import { processStreamOutput } from "../utils/processStreamOutput.js";

class DockerService {
  constructor() {
    this.docker = new Dockerode({
      socketPath: "/Users/darshan/.docker/run/docker.sock",
    });
  }

  async createContainer(projectId) {
    const container = await this.docker.createContainer({
      Image: "cloud-ide",
      AttachStderr: true,
      AttachStdin: true,
      AttachStdout: true,
      Cmd: "/bin/bash".split(" "),
      Tty: true,
      Volumes: {
        "/home/cloud-ide/code": {},
      },
      HostConfig: {
        Binds: [
          `${process.env.PLAYGROUNDS_PATH}/${projectId}:/home/cloud-ide/code`,
        ],
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }],
        },
      },
      ExposedPorts: {
        "5173/tcp": {},
      },
    });

    await container.start();
    return container.id;
  }

  async excecuteCommand(containerId, ws) {
    const container = this.docker.getContainer(containerId);
    const data = await container.inspect();
    if (!data.State.Running) {
      await container.start();
    }
    container.exec(
      {
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        User: "cloud-ide",
      },
      (err, exec) => {
        if (err) {
          console.error(err);
          return;
        }
        exec.start(
          {
            stdin: false,
            hijack: true,
          },
          (err, stream) => {
            processStreamOutput(stream, ws);
            ws.on("message", (message) => {
              stream.write(message);
            });
          }
        );
      }
    );
  }

  async getContainer(containerId) {
    return this.docker.getContainer(containerId);
  }

  async stopContainer(containerId) {
    const container = this.docker.getContainer(containerId);
    try {
      await container.stop();
      await container.remove();
    } catch (err) {
      console.error(`Error stopping/removing container: ${err.message}`);
    }
  }
  async getContainerLogs(containerId) {
    const container = this.docker.getContainer(containerId);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: true,
    });

    return logs.toString();
  }

  async getContainerCWD(containerId) {
    const container = this.docker.getContainer(containerId);
    const containerInfo = await container.inspect();
    return containerInfo.Config.WorkingDir;
  }

  async containerExists(containerName) {
    const containers = await this.docker.listContainers({ all: true });
    return containers.some((container) =>
      container.Names.includes(`/${containerName}`)
    );
  }

  async removeContainer(containerId) {
    const container = this.docker.getContainer(containerId);
    await container.remove();
  }
}

export default DockerService;
