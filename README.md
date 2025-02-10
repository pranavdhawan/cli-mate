# Climate
## Description
This is a simple application that allows you to view the weather for a city. (in cli, not gui, that's cool, admit it.)

#### Installation

```bash
npm i @killkennyale/cli-mate
```

#### Check today's weather
```bash
cli-mate <command> [options]
```
#### Commands

```bash
# Get weather for London
cli-mate today london

# Alternative ways to specify location
cli-mate today --location london
cli-mate today -l london

# Get 7 day forecast
cli-mate forecast --location london
cli-mate forecast -l london

# Get help
cli-mate help
cli-mate --help
cli-mate -h

# Check version
cli-mate version
cli-mate --version
cli-mate -v
```
