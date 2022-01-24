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

# Testing Strategy

cloudformation deployments take a long time, and are hard to handle within jest unit tests.
This project involves a lot of code that generates cloudformation. In order to test this,
we can do the following:

-   Deploy Cloudformation templates for each resource type using the DEPLOY pipeline action
-   in order to test that our CF generating functions are doing the right thing, we can run
    those functions in our jest tests, use `deployStack` function to deploy cloudformation, and give the template
    the same name as a template that was deployed in the previous pipeline step. The expectation
    is that there should be no difference, and the ``deployStack` will return quickly. If there
    is a change, it will either timeout because CF takes a long time, or a response other than
    `status: nothing` will be given, in which case we will fail the test
-   this strategy allows us to still test our functions are producing the right CF without having
    to do a long deployment in our jest tests. The long deployment happens in the DEPLOY pipeline
    step, and our jest tests confirm that what we deployed manually is the same as what our
    helper functions generate.
