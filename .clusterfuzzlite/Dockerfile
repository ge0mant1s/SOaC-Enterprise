# ClusterFuzzLite build image for the SOaC validation harness (JavaScript/Jazzer.js).
# Base image ships the ClusterFuzzLite + Jazzer.js toolchain.
FROM gcr.io/oss-fuzz-base/base-builder-javascript

# Copy the whole repo; build.sh compiles the harness and stages the fuzzers.
COPY . $SRC/soac
WORKDIR $SRC/soac
COPY .clusterfuzzlite/build.sh $SRC/build.sh
