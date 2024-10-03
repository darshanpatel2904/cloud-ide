FROM ubuntu:20.04
RUN useradd -ms /bin/bash coludIde
WORKDIR /home/colud-ide/
RUN apt update && apt upgrade -y
RUN apt install curl nano -y
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt install -y nodejs
RUN echo "PS1='\w '">>/home/colud-ide/.bashrc
WORKDIR /home/colud-ide/code

