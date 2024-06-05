FROM redhat-io-devops-p.apps.ocp.previc.gov/ubi8/nodejs-20 as builder

# Add application sources to a directory that the assemble script expects them
# and set permissions so that the container runs without root access
USER 0
ADD . /tmp/src
RUN ls -al /tmp/src
RUN chown -R 1001:0 /tmp/src
USER 1001

# Install the dependencies
ENV NPM_RUN build
ENV NPM_MIRROR http://nexus-devops-p.apps.ocp.previc.gov/repository/npm-proxy/
RUN /usr/libexec/s2i/assemble
RUN ls
RUN pwd

# Set the default command for the resulting image
#CMD /usr/libexec/s2i/run

FROM redhat-io-devops-p.apps.ocp.previc.gov/rhel8/httpd-24:1-215
COPY --from=builder /opt/app-root/src/dist/virtus-frontend/ /var/www/html
CMD run-httpd