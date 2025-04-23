FROM public.ecr.aws/lambda/nodejs:22

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json package-lock.json ./
RUN npm install

COPY index.js ${LAMBDA_TASK_ROOT}

CMD [ "index.handler" ]
