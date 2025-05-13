# GIT_REVISION = $(shell git rev-parse HEAD | grep -o '^.\{10\}')
# PROJECT = $(shell git rev-parse --show-toplevel)
BEDROCK = $(realpath ../../Bedrock)
INCLUDE = -I$(BEDROCK) -I$(BEDROCK)/mbedtls/include -I../plugin
# CXXFLAGS = -g -std=c++20 -fpic -O2 $(BEDROCK_OPTIM_COMPILE_FLAG) -Wall -Werror -Wformat-security -Wno-unqualified-std-cast-call -DGIT_REVISION=$(GIT_REVISION) $(INCLUDE)
CXXFLAGS = -g -std=c++20 -fpic -O2 $(BEDROCK_OPTIM_COMPILE_FLAG) -Wall -Werror -Wformat-security -Wno-unqualified-std-cast-call $(INCLUDE)

# We'll stick object and dependency files in here so we don't need to look at them.
INTERMEDIATEDIR = .build

# These targets aren't actual files.
.PHONY: all clean test

# This sets our default by being the first target, and also sets `all` in case someone types `make all`.
all: ToDoApp.so

test:
	$(MAKE) -C test

clean:
	rm -rf $(INTERMEDIATEDIR)
	rm -rf ToDoApp.so
	rm -rf precompile.d
	rm -rf precompile.h.gch
	$(MAKE) -C test clean

# We're going to build a shared library from every CPP file in this directory or it's children.
BTACPP = $(shell find * -name '*.cpp')
BTAOBJ = $(BTACPP:%.cpp=$(INTERMEDIATEDIR)/%.o)
BTADEP = $(BTACPP:%.cpp=$(INTERMEDIATEDIR)/%.d)

# Bring in the dependency files. This will cause them to be created if necessary. This is skipped if we're cleaning, as
# they'll just get deleted anyway.
ifneq ($(MAKECMDGOALS),clean)
-include $(BTADEP)
endif

# The main library depends on all the .o files.
ToDoApp.so: $(BTAOBJ)
	$(CXX) $(CXXFLAGS) -shared -o $@ $(BTAOBJ)

# Make dependency files from cpp files, putting them in $INTERMEDIATEDIR.
# This is the same as making the object files, both dependencies and object files are built together. The only
# difference is that here, the fie passed as `-MF` is the target, and the output file is a modified version of that,
# where for the object file rule, the reverse is true.
$(INTERMEDIATEDIR)/%.d: %.cpp $(PRECOMPILE_H)
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -MMD -MF $@ $(PRECOMPILE_INCLUDE) -o $(INTERMEDIATEDIR)/$*.o -c $<

# Make object files from cpp files, putting them in $INTERMEDIATEDIR.
# This is the same as making the dependency files, both dependencies and object files are built together.
$(INTERMEDIATEDIR)/%.o: %.cpp $(INTERMEDIATEDIR)/%.d
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -MMD -MF $(INTERMEDIATEDIR)/$*.d $(PRECOMPILE_INCLUDE) -o $@ -c $<
