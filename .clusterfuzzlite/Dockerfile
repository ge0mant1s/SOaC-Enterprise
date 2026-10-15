# ClusterFuzzLite build image for the SOaC validation harness (JavaScript/Jazzer.js).
# Base image ships the ClusterFuzzLite + Jazzer.js toolchain.
# Pinned by digest (OpenSSF Scorecard Pinned-Dependencies). Refresh with:
#   docker buildx imagetools inspect gcr.io/oss-fuzz-base/base-builder-javascript:latest
FROM gcr.io/oss-fuzz-base/base-builder-javascript@sha256:fff2fe5f532ffcd3fcea7c54cc1db18951b364b64aa37c415348ce8ba17cde34

# Copy the whole repo; build.sh compiles the harness and stages the fuzzers.
COPY . $SRC/soac
WORKDIR $SRC/soac
COPY .clusterfuzzlite/build.sh $SRC/build.sh
