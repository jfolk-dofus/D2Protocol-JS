java -jar ffdec.jar -export script ./dofus-src DofusInvoker.swf
mv dofus-src/scripts/* dofus-src
../protocol-builder/build.sh
git 