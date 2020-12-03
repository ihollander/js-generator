# Vanilla JS Generator

A Node CLI for generating vanilla JavaScript applications

## Usage

You can run this package using `npx`:

```sh
$ npx @ihollander/js-generator project-name
```

This will generate the following files:

```
.
├── project-name
│   ├── src
│   │   └── index.js
│   ├── styles
│   │   └── main.css
│   └── index.html
```

It will also initialize a local `git` repository in the project.

## Contributing

If you'd like to make a contribution, fork this project and make a pull request with your new features! Here are some ideas for how to extend this project:

- Use file templates instead of strings?
- Use `inquirer`, `chalk`, `figlet`, etc for nicer terminal output?
- Create a remote repo on Github & push up the code?
- Whatever your heart desires!

If you're curious how this was put together, check out the [lecture readme](LECTURE.md) or [video](https://youtu.be/1_wyb2Wh4m0).