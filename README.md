# shbc-adhoc-bill-file-transfer Tool

## Data Transfer Processs: Ctax Daily Adhoc Bill Files

node version 6.11.2

### Objective

1. Must Have. Check for the existence of two data files once a day, that have been created by an automated process to generate Council Tax bills.
If one or both of those files exist copy them to another directory where the billing process picks the data up.
2. Could Have. Notify the Digital Dev team that the file(s) have / have not been copied using the Devops Slack channel.

### Resources

Environment Variables:

- location A: `envA`
- location B: `envB`
- file 1 example file name: `env1`
- file 2 exmample file name: `env2`
- slack account url: `slack`
- slack icon url : `slackIcon`

NPM Dependencies:
- moment
- node-slackr
- promise

### Algorithm

1. search `envA` for today's file (`env1` / `env2`)
2. if file(s) exist copy them to the billing directory: `envArc`
3. notify Revs & Bens that the TAR file is present using SMTP
4. notify Devops the process outcome with Slack
