FROM buildkite/puppeteer
RUN mkdir -p /code/
WORKDIR /code

ADD ssg.js /code/
ADD publish.yml /code/

RUN apt-get update && apt-get install -y python3-pip
RUN pip3 install ansible boto3

CMD ansible --version