# Rise Foundation

## StyleGuide

This project follows the Deno style guide for code: https://deno.land/manual/contributing/style_guide

Exceptions to this sytle guide include

-   we use index instead of mod since index is a commonly understood convention

## Things to figure out

Everything should implement the following in the same way

-   aws sdk (injected or assumed as part of the env)
-   region (injected or assumed as AWS_REGION)
-   resource ids (tables, cognito pools) (injected or assumed as env variables?)
